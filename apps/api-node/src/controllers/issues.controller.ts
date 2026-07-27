import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import {
  IssueStatus,
  IssueCategory,
  IssueUrgency,
  LocationType,
  UserRole,
  CommentVisibility,
  CreateIssueDto,
  UpdateIssueStatusDto,
  UpdateIssueAssignmentDto,
  CreateCommentDto,
} from '@dormflow/shared-types';
import { StoreService } from '../services/store.service.js';
import { authenticateJwt, requireRole } from '../middleware/auth.js';

export const issuesRouter = Router();

// GET /api/issues
// Publicly accessible for Web Component or authenticated users, with optional filtering
issuesRouter.get('/', (req: Request, res: Response) => {
  const store = StoreService.getInstance();
  const {
    buildingId,
    category,
    urgency,
    status,
    search,
    mineOnly,
    userId,
    page = '1',
    limit = '50',
  } = req.query;

  let results = [...store.issues];

  if (buildingId) {
    results = results.filter(i => i.buildingId === buildingId);
  }
  if (category) {
    results = results.filter(i => i.category === category);
  }
  if (urgency) {
    results = results.filter(i => i.urgency === urgency);
  }
  if (status) {
    results = results.filter(i => i.status === status);
  }
  if (mineOnly && userId) {
    results = results.filter(i => i.createdByUserId === userId || i.assignedToUserId === userId);
  }
  if (search) {
    const term = String(search).toLowerCase();
    results = results.filter(
      i =>
        i.title.toLowerCase().includes(term) ||
        i.description.toLowerCase().includes(term) ||
        (i.roomNumber && i.roomNumber.toLowerCase().includes(term)),
    );
  }

  // Sort descending by updated date
  results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const currentUserId = req.user?.id || (userId as string);
  const enriched = results.map(issue => store.enrichIssue(issue, currentUserId));

  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 50;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = enriched.slice(startIndex, startIndex + limitNum);

  res.json({
    data: paginated,
    total: enriched.length,
    page: pageNum,
    limit: limitNum,
  });
});

// POST /api/issues (Residents or Managers)
issuesRouter.post('/', authenticateJwt, (req: Request, res: Response) => {
  const {
    title,
    description,
    category,
    urgency,
    locationType,
    buildingId,
    roomNumber,
  } = req.body as CreateIssueDto;

  if (!title || !description || !category || !urgency || !locationType || !buildingId) {
    res.status(400).json({
      statusCode: 400,
      message: 'Title, description, category, urgency, locationType and buildingId are required',
      correlationId: req.correlationId,
    });
    return;
  }

  const store = StoreService.getInstance();
  const issueId = `iss-${crypto.randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();

  const newIssue = {
    id: issueId,
    title,
    description,
    category,
    urgency,
    status: IssueStatus.SUBMITTED,
    locationType,
    buildingId,
    roomNumber: roomNumber || null,
    createdByUserId: req.user!.id,
    assignedToUserId: null,
    duplicateOfIssueId: null,
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
  };

  store.issues.unshift(newIssue);

  // Record initial status history event
  store.history.unshift({
    id: `hst-${crypto.randomUUID().slice(0, 8)}`,
    issueId,
    previousStatus: null,
    newStatus: IssueStatus.SUBMITTED,
    changedByUserId: req.user!.id,
    changedByName: req.user!.displayName,
    note: 'Initial report submitted via DormFlow Portal',
    createdAt: now,
  });

  const enriched = store.enrichIssue(newIssue, req.user!.id);
  res.status(201).json(enriched);
});

// GET /api/issues/:issueId (Supports Web Component directly or authenticated)
issuesRouter.get('/:issueId', (req: Request, res: Response) => {
  const store = StoreService.getInstance();
  const issue = store.issues.find(i => i.id === req.params.issueId);

  if (!issue) {
    res.status(404).json({
      statusCode: 404,
      message: `Issue with ID '${req.params.issueId}' was not found`,
      correlationId: req.correlationId,
    });
    return;
  }

  const enriched = store.enrichIssue(issue, req.user?.id);
  res.json(enriched);
});

// PATCH /api/issues/:issueId
issuesRouter.patch('/:issueId', authenticateJwt, (req: Request, res: Response) => {
  const store = StoreService.getInstance();
  const index = store.issues.findIndex(i => i.id === req.params.issueId);

  if (index === -1) {
    res.status(404).json({
      statusCode: 404,
      message: 'Issue not found',
      correlationId: req.correlationId,
    });
    return;
  }

  const issue = store.issues[index];
  const isOwner = issue.createdByUserId === req.user!.id;
  const isStaff = req.user!.role === UserRole.MANAGER || req.user!.role === UserRole.TECHNICIAN;

  if (!isOwner && !isStaff) {
    res.status(403).json({
      statusCode: 403,
      message: 'You are not authorized to update this issue',
      correlationId: req.correlationId,
    });
    return;
  }

  const { title, description, category, urgency, locationType, roomNumber, duplicateOfIssueId } = req.body;
  if (title !== undefined) issue.title = title;
  if (description !== undefined) issue.description = description;
  if (category !== undefined) issue.category = category;
  if (urgency !== undefined) issue.urgency = urgency;
  if (locationType !== undefined) issue.locationType = locationType;
  if (roomNumber !== undefined) issue.roomNumber = roomNumber;
  if (duplicateOfIssueId !== undefined) issue.duplicateOfIssueId = duplicateOfIssueId;
  issue.updatedAt = new Date().toISOString();

  res.json(store.enrichIssue(issue, req.user!.id));
});

// DELETE /api/issues/:issueId (Manager only)
issuesRouter.delete('/:issueId', authenticateJwt, requireRole(UserRole.MANAGER), (req: Request, res: Response) => {
  const store = StoreService.getInstance();
  const index = store.issues.findIndex(i => i.id === req.params.issueId);

  if (index === -1) {
    res.status(404).json({
      statusCode: 404,
      message: 'Issue not found',
      correlationId: req.correlationId,
    });
    return;
  }

  store.issues.splice(index, 1);
  res.json({ success: true, message: 'Issue deleted successfully' });
});

// PATCH /api/issues/:issueId/status (Managers and Technicians)
issuesRouter.patch(
  '/:issueId/status',
  authenticateJwt,
  requireRole(UserRole.MANAGER, UserRole.TECHNICIAN),
  (req: Request, res: Response) => {
    const { status, note } = req.body as UpdateIssueStatusDto;

    if (!status || !Object.values(IssueStatus).includes(status)) {
      res.status(400).json({
        statusCode: 400,
        message: `Valid status required (${Object.values(IssueStatus).join(', ')})`,
        correlationId: req.correlationId,
      });
      return;
    }

    const store = StoreService.getInstance();
    const issue = store.issues.find(i => i.id === req.params.issueId);

    if (!issue) {
      res.status(404).json({
        statusCode: 404,
        message: 'Issue not found',
        correlationId: req.correlationId,
      });
      return;
    }

    const previousStatus = issue.status;
    const now = new Date().toISOString();
    issue.status = status;
    issue.updatedAt = now;

    if (status === IssueStatus.RESOLVED || status === IssueStatus.CLOSED) {
      issue.resolvedAt = now;
    } else {
      issue.resolvedAt = null;
    }

    // Add status history entry
    store.history.unshift({
      id: `hst-${crypto.randomUUID().slice(0, 8)}`,
      issueId: issue.id,
      previousStatus,
      newStatus: status,
      changedByUserId: req.user!.id,
      changedByName: req.user!.displayName,
      note: note || `Status transitioned to ${status}`,
      createdAt: now,
    });

    res.json(store.enrichIssue(issue, req.user!.id));
  },
);

// PATCH /api/issues/:issueId/assignment (Managers only)
issuesRouter.patch(
  '/:issueId/assignment',
  authenticateJwt,
  requireRole(UserRole.MANAGER),
  (req: Request, res: Response) => {
    const { assignedToUserId, note } = req.body as UpdateIssueAssignmentDto;
    const store = StoreService.getInstance();
    const issue = store.issues.find(i => i.id === req.params.issueId);

    if (!issue) {
      res.status(404).json({
        statusCode: 404,
        message: 'Issue not found',
        correlationId: req.correlationId,
      });
      return;
    }

    let assigneeName = 'Unassigned';
    if (assignedToUserId) {
      const assignee = store.users.find(u => u.id === assignedToUserId);
      if (!assignee) {
        res.status(404).json({
          statusCode: 404,
          message: 'Assignee user not found',
          correlationId: req.correlationId,
        });
        return;
      }
      assigneeName = assignee.displayName;
    }

    issue.assignedToUserId = assignedToUserId || null;
    if (assignedToUserId && issue.status === IssueStatus.SUBMITTED) {
      issue.status = IssueStatus.ASSIGNED;
    }
    const now = new Date().toISOString();
    issue.updatedAt = now;

    store.history.unshift({
      id: `hst-${crypto.randomUUID().slice(0, 8)}`,
      issueId: issue.id,
      previousStatus: issue.status,
      newStatus: issue.status,
      changedByUserId: req.user!.id,
      changedByName: req.user!.displayName,
      note: note || `Assigned to ${assigneeName}`,
      createdAt: now,
    });

    res.json(store.enrichIssue(issue, req.user!.id));
  },
);

// POST /api/issues/:issueId/followers (Follow an issue)
issuesRouter.post('/:issueId/followers', authenticateJwt, (req: Request, res: Response) => {
  const store = StoreService.getInstance();
  const issue = store.issues.find(i => i.id === req.params.issueId);

  if (!issue) {
    res.status(404).json({
      statusCode: 404,
      message: 'Issue not found',
      correlationId: req.correlationId,
    });
    return;
  }

  const already = store.followers.find(
    f => f.issueId === issue.id && f.userId === req.user!.id,
  );

  if (!already) {
    store.followers.push({
      issueId: issue.id,
      userId: req.user!.id,
      createdAt: new Date().toISOString(),
    });
  }

  res.status(201).json({ success: true, message: 'Subscribed to issue updates' });
});

// DELETE /api/issues/:issueId/followers/me (Unfollow)
issuesRouter.delete('/:issueId/followers/me', authenticateJwt, (req: Request, res: Response) => {
  const store = StoreService.getInstance();
  store.followers = store.followers.filter(
    f => !(f.issueId === req.params.issueId && f.userId === req.user!.id),
  );
  res.json({ success: true, message: 'Unfollowed issue' });
});

// GET /api/issues/:issueId/history
issuesRouter.get('/:issueId/history', (req: Request, res: Response) => {
  const store = StoreService.getInstance();
  const history = store.history.filter(h => h.issueId === req.params.issueId);
  res.json(history);
});

// GET /api/issues/:issueId/comments
issuesRouter.get('/:issueId/comments', authenticateJwt, (req: Request, res: Response) => {
  const store = StoreService.getInstance();
  let comments = store.comments.filter(c => c.issueId === req.params.issueId);

  // If resident, filter out internal comments
  if (req.user!.role === UserRole.RESIDENT) {
    comments = comments.filter(c => c.visibility === CommentVisibility.PUBLIC);
  }

  const enrichedComments = comments.map(c => {
    const author = store.users.find(u => u.id === c.authorId);
    return {
      ...c,
      authorName: author?.displayName || 'Unknown User',
      authorRole: author?.role,
    };
  });

  res.json(enrichedComments);
});

// POST /api/issues/:issueId/comments
issuesRouter.post('/:issueId/comments', authenticateJwt, (req: Request, res: Response) => {
  const { content, visibility } = req.body as CreateCommentDto;

  if (!content || !content.trim()) {
    res.status(400).json({
      statusCode: 400,
      message: 'Comment content cannot be empty',
      correlationId: req.correlationId,
    });
    return;
  }

  const store = StoreService.getInstance();
  const issue = store.issues.find(i => i.id === req.params.issueId);

  if (!issue) {
    res.status(404).json({
      statusCode: 404,
      message: 'Issue not found',
      correlationId: req.correlationId,
    });
    return;
  }

  const commentVisibility =
    req.user!.role === UserRole.RESIDENT ? CommentVisibility.PUBLIC : (visibility || CommentVisibility.PUBLIC);

  const newComment = {
    id: `cmt-${crypto.randomUUID().slice(0, 8)}`,
    issueId: issue.id,
    authorId: req.user!.id,
    content: content.trim(),
    visibility: commentVisibility,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.comments.push(newComment);
  issue.updatedAt = new Date().toISOString();

  res.status(201).json({
    ...newComment,
    authorName: req.user!.displayName,
    authorRole: req.user!.role,
  });
});
