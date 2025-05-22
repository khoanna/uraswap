
export default function CardContent({ children, ...props }) {
    return (
        <div className={`p-4 ${props.className || ""}`}>{children}</div>
    );
}