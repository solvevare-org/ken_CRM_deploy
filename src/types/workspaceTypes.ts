// Types and Interfaces
export interface Workspace {
  _id: string;
  name: string;
  type: "personal" | "organization";
  white_label_configurations?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceAvailability {
  name: string;
  exists: boolean;
  available: boolean;
  message: string;
}

export interface CreateWorkspaceData {
  name: string;
  type: "personal" | "organization";
  white_label_configurations?: any;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
}

export interface SelectedWorkspaceResponse {
  workspace: {
    id: string;
    name: string;
  };
  token: string;
}

export interface WorkspaceState {
  workspaces: any[];
  currentWorkspace: any | null;
  selectedWorkspace: any | null;
  workspaceType: string | null;
  workspaceAvailability: {
    name: string;
    exists: boolean;
    available: boolean;
    message: string;
  };
  loading: {
    getWorkspaces: boolean;
    getWorkspaceByName: boolean;
    createWorkspace: boolean;
    checkWorkspaceExists: boolean;
    selectWorkspace: boolean;
    inviteRealtor: boolean;
    acceptInvite: boolean;
    inviteByEmail: boolean;
    promoteRealtor: boolean;
    removeRealtor: boolean;
  };
  error: {
    getWorkspaces: string | null;
    getWorkspaceByName: string | null;
    createWorkspace: string | null;
    checkWorkspaceExists: string | null;
    selectWorkspace: string | null;
    inviteRealtor: string | null;
    acceptInvite: string | null;
    inviteByEmail: string | null;
    promoteRealtor: string | null;
    removeRealtor: string | null;
  };
}

export interface RootState {
  workspace: WorkspaceState;
}

export interface InviteRealtorRequest {
  realtorId: string;
  role: "admin" | "realtor";
}

export interface InviteRealtorResponse {
  inviteId: string;
  token: string;
}

export interface AcceptInviteRequest {
  token: string;
}

export interface AcceptInviteResponse {
  workspaceId: string;
}

export interface InviteByEmailRequest {
  email: string;
  role: "admin" | "realtor";
}

export interface InviteByEmailResponse {
  inviteUrl: string;
}

export interface PromoteRealtorRequest {
  realtorId: string;
}

export interface PromoteRealtorResponse {
  realtorId: string;
}

export interface RemoveRealtorResponse {
  realtorId: string;
  removedFromMembership: boolean;
  removedFromAdmins: boolean;
}
