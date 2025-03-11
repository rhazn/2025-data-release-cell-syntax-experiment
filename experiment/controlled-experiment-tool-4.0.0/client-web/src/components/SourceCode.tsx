interface SourceCodeProps {
    code: string;
}

export const SourceCode: React.FC<SourceCodeProps> = ({
    code,
}: SourceCodeProps) => {
    return (
        <pre className="text-sm text-left">
            <code>{code}</code>
        </pre>
    );
};
