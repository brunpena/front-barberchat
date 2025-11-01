interface BoxProps {
    mensage: string;
}

const BoxBot = ({ mensage }: BoxProps) => {
    return (
        <div className="flex justify-start">
            <div className="bg-gray-200 p-4 rounded-lg max-w-2xl">
                <p className="text-gray-800">{mensage}</p>
            </div>
        </div>
    );
};

const BoxUser = ({ mensage }: BoxProps) => {
    return (
        <div className="flex justify-end">
            <div className="bg-blue-500 p-4 rounded-lg max-w-2xl">
                <p className="text-white">{mensage}</p>
            </div>
        </div>
    );
};

export { BoxBot, BoxUser };
