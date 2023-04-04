export interface S3Backend {
    endpoint: string;
    bucket: string;
    region: string;
    key: string;
    prefix: string;
}
