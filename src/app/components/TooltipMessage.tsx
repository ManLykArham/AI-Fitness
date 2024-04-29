interface TooltipMessageProps {
  onClose: () => void;
  message: string;
}

const TooltipMessage: React.FC<TooltipMessageProps> = ({
  onClose,
  message,
}) => {
  return (
    <div className="m-3 bg-white p-4 border rounded shadow-lg">
      <p>{message}</p>
      <button onClick={onClose} className="text-sm text-blue-700">
        Close
      </button>
    </div>
  );
};

export default TooltipMessage;
