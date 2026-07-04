// Enums
export enum UserRole {
  RESIDENT = 'RESIDENT',
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
}

export enum IssueStatus {
  SUBMITTED = 'SUBMITTED',
  REVIEWED = 'REVIEWED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export enum IssueCategory {
  HEATING = 'HEATING',
  INTERNET = 'INTERNET',
  WATER = 'WATER',
  ELECTRICITY = 'ELECTRICITY',
  LAUNDRY = 'LAUNDRY',
  KITCHEN = 'KITCHEN',
  FURNITURE = 'FURNITURE',
  CLEANLINESS = 'CLEANLINESS',
  OTHER = 'OTHER',
}

export enum IssueUrgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  EMERGENCY = 'EMERGENCY',
}

export enum LocationType {
  PRIVATE_ROOM = 'PRIVATE_ROOM',
  SHARED_KITCHEN = 'SHARED_KITCHEN',
  LAUNDRY_ROOM = 'LAUNDRY_ROOM',
  HALLWAY = 'HALLWAY',
  OUTDOOR_AREA = 'OUTDOOR_AREA',
  OTHER = 'OTHER',
}

export enum CommentVisibility {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
}

// Entities
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  buildingId?: string | null;
  buildingName?: string | null;
  roomNumber?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  urgency: IssueUrgency;
  status: IssueStatus;
  locationType: LocationType;
  buildingId: string;
  building?: Building;
  roomNumber?: string | null;
  createdByUserId: string;
  createdByUser?: {
    id: string;
    displayName: string;
    email: string;
  };
  assignedToUserId?: string | null;
  assignedToUser?: {
    id: string;
    displayName: string;
    email: string;
    role: UserRole;
  } | null;
  duplicateOfIssueId?: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  commentsCount?: number;
  followersCount?: number;
  isFollowedByMe?: boolean;
}

export interface Comment {
  id: string;
  issueId: string;
  authorId: string;
  authorName?: string;
  authorRole?: UserRole;
  content: string;
  visibility: CommentVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface IssueStatusHistory {
  id: string;
  issueId: string;
  previousStatus?: IssueStatus | null;
  newStatus: IssueStatus;
  changedByUserId: string;
  changedByName?: string;
  note?: string | null;
  createdAt: string;
}

export interface IssueFollower {
  issueId: string;
  userId: string;
  createdAt: string;
}

export interface DashboardSummary {
  openIssues: number;
  urgentIssues: number;
  resolvedThisWeek: number;
  averageResolutionHours: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
}

// DTOs
export interface RegisterDto {
  email: string;
  password: string;
  displayName: string;
  buildingId?: string;
  roomNumber?: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CreateIssueDto {
  title: string;
  description: string;
  category: IssueCategory;
  urgency: IssueUrgency;
  locationType: LocationType;
  buildingId: string;
  roomNumber?: string;
}

export interface UpdateIssueStatusDto {
  status: IssueStatus;
  note?: string;
}

export interface UpdateIssueAssignmentDto {
  assignedToUserId: string | null;
  note?: string;
}

export interface CreateCommentDto {
  content: string;
  visibility?: CommentVisibility;
}

export interface IssueFilterParams {
  buildingId?: string;
  category?: IssueCategory;
  urgency?: IssueUrgency;
  status?: IssueStatus;
  search?: string;
  mineOnly?: boolean;
  page?: number;
  limit?: number;
}
