import bcrypt from 'bcryptjs';
import {
  User,
  Building,
  Issue,
  Comment,
  IssueStatusHistory,
  IssueFollower,
  UserRole,
  IssueStatus,
  IssueCategory,
  IssueUrgency,
  LocationType,
  CommentVisibility,
  DashboardSummary,
  CreateIssueDto,
  IssueFilterParams,
} from '@dormflow/shared-types';

export class StoreService {
  private static instance: StoreService;

  public users: (User & { passwordHash: string })[] = [];
  public buildings: Building[] = [];
  public issues: Issue[] = [];
  public comments: Comment[] = [];
  public history: IssueStatusHistory[] = [];
  public followers: IssueFollower[] = [];

  private constructor() {
    this.seedInitialData();
  }

  public static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  private seedInitialData(): void {
    const defaultPasswordHash = bcrypt.hashSync('Password123!', 10);

    // Buildings in Aachen
    this.buildings = [
      {
        id: 'bld-kastanienweg',
        name: 'Wohnheim Kastanienweg',
        address: 'Kastanienweg 35, 52074 Aachen',
        createdAt: '2026-07-01T08:00:00.000Z',
        updatedAt: '2026-07-01T08:00:00.000Z',
      },
      {
        id: 'bld-eckertweg',
        name: 'Wohnheim Eckertweg (Turm)',
        address: 'Eckertweg 20, 52074 Aachen',
        createdAt: '2026-07-01T08:00:00.000Z',
        updatedAt: '2026-07-01T08:00:00.000Z',
      },
      {
        id: 'bld-halifax',
        name: 'Studentenresidenz Halifaxstraße',
        address: 'Halifaxstraße 85, 52074 Aachen',
        createdAt: '2026-07-01T08:00:00.000Z',
        updatedAt: '2026-07-01T08:00:00.000Z',
      },
      {
        id: 'bld-mattschoe',
        name: 'Wohnanlage Mattschö-Moll-Weg',
        address: 'Mattschö-Moll-Weg 2, 52074 Aachen',
        createdAt: '2026-07-01T08:00:00.000Z',
        updatedAt: '2026-07-01T08:00:00.000Z',
      },
    ];

    // Users
    this.users = [
      {
        id: 'usr-manager-daniel',
        email: 'daniel@dormflow.rwth.de',
        displayName: 'Daniel Becker',
        passwordHash: defaultPasswordHash,
        role: UserRole.MANAGER,
        buildingId: null,
        buildingName: 'Central Facility Management',
        roomNumber: 'Office 1.04',
        createdAt: '2026-07-01T09:00:00.000Z',
        updatedAt: '2026-07-01T09:00:00.000Z',
      },
      {
        id: 'usr-tech-marcus',
        email: 'marcus@dormflow.rwth.de',
        displayName: 'Marcus Weber (Sanitary & Heating)',
        passwordHash: defaultPasswordHash,
        role: UserRole.TECHNICIAN,
        buildingId: null,
        buildingName: 'Field Engineering Team',
        roomNumber: null,
        createdAt: '2026-07-01T09:15:00.000Z',
        updatedAt: '2026-07-01T09:15:00.000Z',
      },
      {
        id: 'usr-resident-lina',
        email: 'lina@rwth-aachen.de',
        displayName: 'Lina Al-Mansoor',
        passwordHash: defaultPasswordHash,
        role: UserRole.RESIDENT,
        buildingId: 'bld-kastanienweg',
        buildingName: 'Wohnheim Kastanienweg',
        roomNumber: '412',
        createdAt: '2026-07-02T10:00:00.000Z',
        updatedAt: '2026-07-02T10:00:00.000Z',
      },
      {
        id: 'usr-rep-noor',
        email: 'noor@rwth-aachen.de',
        displayName: 'Noor El-Sayed (Resident Council)',
        passwordHash: defaultPasswordHash,
        role: UserRole.RESIDENT,
        buildingId: 'bld-eckertweg',
        buildingName: 'Wohnheim Eckertweg (Turm)',
        roomNumber: '1105',
        createdAt: '2026-07-02T11:00:00.000Z',
        updatedAt: '2026-07-02T11:00:00.000Z',
      },
    ];

    // Issues
    this.issues = [
      {
        id: 'iss-101',
        title: 'Radiator valve leaking and cold in bedroom',
        description: 'The bedroom radiator does not heat up and drops water steadily onto the parquet floor.',
        category: IssueCategory.HEATING,
        urgency: IssueUrgency.HIGH,
        status: IssueStatus.IN_PROGRESS,
        locationType: LocationType.PRIVATE_ROOM,
        buildingId: 'bld-kastanienweg',
        roomNumber: '412',
        createdByUserId: 'usr-resident-lina',
        assignedToUserId: 'usr-tech-marcus',
        duplicateOfIssueId: null,
        createdAt: '2026-07-10T14:30:00.000Z',
        updatedAt: '2026-07-11T09:20:00.000Z',
        resolvedAt: null,
      },
      {
        id: 'iss-102',
        title: 'Washing machine 3 displays Error E20 (drain blocked)',
        description: 'Basement laundry room: Machine 3 stops mid-cycle with water remaining inside.',
        category: IssueCategory.LAUNDRY,
        urgency: IssueUrgency.MEDIUM,
        status: IssueStatus.ASSIGNED,
        locationType: LocationType.LAUNDRY_ROOM,
        buildingId: 'bld-kastanienweg',
        roomNumber: 'Basement Room U02',
        createdByUserId: 'usr-resident-lina',
        assignedToUserId: 'usr-tech-marcus',
        duplicateOfIssueId: null,
        createdAt: '2026-07-14T18:00:00.000Z',
        updatedAt: '2026-07-15T08:45:00.000Z',
        resolvedAt: null,
      },
      {
        id: 'iss-103',
        title: 'Shared kitchen ceiling lamp flickering heavily',
        description: 'Floor 4 kitchen light flickers constantly and makes a buzzing sound.',
        category: IssueCategory.ELECTRICITY,
        urgency: IssueUrgency.LOW,
        status: IssueStatus.SUBMITTED,
        locationType: LocationType.SHARED_KITCHEN,
        buildingId: 'bld-kastanienweg',
        roomNumber: 'Kitchen 4F',
        createdByUserId: 'usr-resident-lina',
        assignedToUserId: null,
        duplicateOfIssueId: null,
        createdAt: '2026-07-18T19:10:00.000Z',
        updatedAt: '2026-07-18T19:10:00.000Z',
        resolvedAt: null,
      },
      {
        id: 'iss-104',
        title: 'Fiber access switch rebooting periodically',
        description: 'Floors 8-12 at Eckertweg experience 5-minute disconnects every hour.',
        category: IssueCategory.INTERNET,
        urgency: IssueUrgency.HIGH,
        status: IssueStatus.RESOLVED,
        locationType: LocationType.HALLWAY,
        buildingId: 'bld-eckertweg',
        roomNumber: 'Distribution Rack 8',
        createdByUserId: 'usr-rep-noor',
        assignedToUserId: 'usr-manager-daniel',
        duplicateOfIssueId: null,
        createdAt: '2026-07-05T09:00:00.000Z',
        updatedAt: '2026-07-06T15:00:00.000Z',
        resolvedAt: '2026-07-06T15:00:00.000Z',
      },
      {
        id: 'iss-105',
        title: 'Entrance hall automatic glass sliding door stuck',
        description: 'Main lobby door remains open 15cm, letting cold draft into the ground floor.',
        category: IssueCategory.OTHER,
        urgency: IssueUrgency.MEDIUM,
        status: IssueStatus.REVIEWED,
        locationType: LocationType.HALLWAY,
        buildingId: 'bld-halifax',
        roomNumber: 'Ground Floor Entry',
        createdByUserId: 'usr-rep-noor',
        assignedToUserId: null,
        duplicateOfIssueId: null,
        createdAt: '2026-07-22T08:15:00.000Z',
        updatedAt: '2026-07-22T10:00:00.000Z',
        resolvedAt: null,
      },
    ];

    // History
    this.history = [
      {
        id: 'hst-1',
        issueId: 'iss-101',
        previousStatus: null,
        newStatus: IssueStatus.SUBMITTED,
        changedByUserId: 'usr-resident-lina',
        note: 'Initial report submitted via Resident Portal',
        createdAt: '2026-07-10T14:30:00.000Z',
      },
      {
        id: 'hst-2',
        issueId: 'iss-101',
        previousStatus: IssueStatus.SUBMITTED,
        newStatus: IssueStatus.REVIEWED,
        changedByUserId: 'usr-manager-daniel',
        note: 'Prioritized as urgent due to parquet damage risk',
        createdAt: '2026-07-10T15:00:00.000Z',
      },
      {
        id: 'hst-3',
        issueId: 'iss-101',
        previousStatus: IssueStatus.REVIEWED,
        newStatus: IssueStatus.ASSIGNED,
        changedByUserId: 'usr-manager-daniel',
        note: 'Assigned to heating specialist Marcus Weber',
        createdAt: '2026-07-10T15:30:00.000Z',
      },
      {
        id: 'hst-4',
        issueId: 'iss-101',
        previousStatus: IssueStatus.ASSIGNED,
        newStatus: IssueStatus.IN_PROGRESS,
        changedByUserId: 'usr-tech-marcus',
        note: 'Inspecting radiator valve gasket replacement parts',
        createdAt: '2026-07-11T09:20:00.000Z',
      },
    ];

    // Comments
    this.comments = [
      {
        id: 'cmt-1',
        issueId: 'iss-101',
        authorId: 'usr-manager-daniel',
        content: 'Hi Lina, please place a small bucket or towel under the radiator until Marcus arrives tomorrow at 9:00 AM.',
        visibility: CommentVisibility.PUBLIC,
        createdAt: '2026-07-10T15:10:00.000Z',
        updatedAt: '2026-07-10T15:10:00.000Z',
      },
      {
        id: 'cmt-2',
        issueId: 'iss-101',
        authorId: 'usr-resident-lina',
        content: 'Thank you! Bucket is in place, floor is protected.',
        visibility: CommentVisibility.PUBLIC,
        createdAt: '2026-07-10T15:25:00.000Z',
        updatedAt: '2026-07-10T15:25:00.000Z',
      },
      {
        id: 'cmt-3',
        issueId: 'iss-101',
        authorId: 'usr-tech-marcus',
        content: 'Internal note: Valve spindle requires 1/2 inch Danfoss replacement gasket.',
        visibility: CommentVisibility.INTERNAL,
        createdAt: '2026-07-11T09:25:00.000Z',
        updatedAt: '2026-07-11T09:25:00.000Z',
      },
    ];

    // Followers
    this.followers = [
      {
        issueId: 'iss-102',
        userId: 'usr-rep-noor',
        createdAt: '2026-07-15T09:00:00.000Z',
      },
    ];
  }

  // Helper resolvers
  public enrichIssue(issue: Issue, currentUserId?: string): Issue {
    const building = this.buildings.find(b => b.id === issue.buildingId);
    const creator = this.users.find(u => u.id === issue.createdByUserId);
    const assignee = issue.assignedToUserId ? this.users.find(u => u.id === issue.assignedToUserId) : null;
    const commentsCount = this.comments.filter(c => c.issueId === issue.id).length;
    const followersCount = this.followers.filter(f => f.issueId === issue.id).length;
    const isFollowedByMe = currentUserId ? this.followers.some(f => f.issueId === issue.id && f.userId === currentUserId) : false;

    return {
      ...issue,
      building,
      createdByUser: creator ? { id: creator.id, displayName: creator.displayName, email: creator.email } : undefined,
      assignedToUser: assignee ? { id: assignee.id, displayName: assignee.displayName, email: assignee.email, role: assignee.role } : null,
      commentsCount,
      followersCount,
      isFollowedByMe,
    };
  }

  public getDashboardSummary(): DashboardSummary {
    const openIssues = this.issues.filter(i => i.status !== IssueStatus.RESOLVED && i.status !== IssueStatus.CLOSED && i.status !== IssueStatus.REJECTED).length;
    const urgentIssues = this.issues.filter(i => (i.urgency === IssueUrgency.HIGH || i.urgency === IssueUrgency.EMERGENCY) && i.status !== IssueStatus.RESOLVED && i.status !== IssueStatus.CLOSED).length;
    const resolvedThisWeek = this.issues.filter(i => i.status === IssueStatus.RESOLVED || i.status === IssueStatus.CLOSED).length;
    
    const byStatus: Record<string, number> = {};
    for (const s of Object.values(IssueStatus)) {
      byStatus[s] = this.issues.filter(i => i.status === s).length;
    }

    const byCategory: Record<string, number> = {};
    for (const c of Object.values(IssueCategory)) {
      byCategory[c] = this.issues.filter(i => i.category === c).length;
    }

    return {
      openIssues,
      urgentIssues,
      resolvedThisWeek,
      averageResolutionHours: 28.4,
      byStatus,
      byCategory,
    };
  }
}
