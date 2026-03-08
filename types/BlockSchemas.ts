export type BlockType = "WORKING" | "REST" | "EXTRA_TIME"

export interface SchemaBlock {
  id: number;
  name: string | null;
  startMinutesFromMidnight: number;
  endMinutesFromMidnight: number;
  blockType: BlockType;
  schemaId: number;
}

export interface CreateSchemaData {
  name: string;
  blocks: SchemaBlock[];
}

export interface UpdateSchemaData {
  name?: string;
  blocks?: SchemaBlock[];
}

export interface Schema {
    blocks: {
        name: string | null;
        id: number;
        startMinutesFromMidnight: number;
        endMinutesFromMidnight: number;
        blockType: BlockType;
        schemaId: number;
    }[];
    name: string;
    id: number;
    companyId: number;
    creatorId: number;
}
