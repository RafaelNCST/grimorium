export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  type:
    | "creation"
    | "transformation"
    | "destruction"
    | "transfer"
    | "discovery";
  relatedEntities: string[];
}

export const mockTimelineEvents: TimelineEvent[] = [];
