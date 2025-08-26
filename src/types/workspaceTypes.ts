// Types and Interfaces
export interface Workspace {
  _id: string;
  name: string;
  type: "personal" | "shared";
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
  type: "personal" | "shared";
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
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  selectedWorkspace: SelectedWorkspaceResponse["workspace"] | null;
  workspaceType: string | null;
  workspaceAvailability: WorkspaceAvailability;
  loading: {
    getWorkspaces: boolean;
    getWorkspaceByName: boolean;
    createWorkspace: boolean;
    checkWorkspaceExists: boolean;
    selectWorkspace: boolean;
  };
  error: {
    getWorkspaces: string | null;
    getWorkspaceByName: string | null;
    createWorkspace: string | null;
    checkWorkspaceExists: string | null;
    selectWorkspace: string | null;
  };
}

export interface RootState {
  workspace: WorkspaceState;
}
