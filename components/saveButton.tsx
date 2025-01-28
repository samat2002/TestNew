import React from 'react';

type SaveButtonProps = {
    onClick: () => void;
    disabled?: boolean;
    className?: string; // Allow passing a custom className
};

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, disabled = false, className }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl shadow-md ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                } ${className}`} // Apply custom className here
        >
            Save
        </button>
    );
};

export default SaveButton;