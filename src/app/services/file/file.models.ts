export class FileModel  {
    filename?: string;
    id: number | string;
    description?: string;
    urldatafile?: string;
    figureInfo?: any = {};
    jInfo?: any;
    jFigureInfo?: any = {};
    trash?: boolean;
    filetype?: string;
    filesize?: number;
    data?: number[][];
    datafields?: string[];
}
