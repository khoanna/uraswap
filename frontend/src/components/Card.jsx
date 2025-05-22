export default function Card({ children, ...props }) {
    return (
        <div
            {...props}
            className="w-full mx-auto mt-4 mb-4 p-6 bg-gradient-to-br from-white/10 via-purple-500/5 to-indigo-500/10 backdrop-blur-md border border-purple-500/30 rounded-3xl shadow-2xl text-white relative overflow-hidden cursor-pointer"
        >
            {children}
        </div>
    );
}

