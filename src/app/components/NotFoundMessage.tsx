interface NotFoundMessageProps {
  itemType: string;
}

const NotFoundMessage: React.FC<NotFoundMessageProps> = ({ itemType }) => {
  return (
    <div className="text-center p-4">
      <p className="text-gray-700">{`No ${itemType} found.`}</p>
    </div>
  );
};

export default NotFoundMessage;
