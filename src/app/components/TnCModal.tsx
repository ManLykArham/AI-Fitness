// TnCModal.tsx
import React from "react";

interface TnCModalProps {
  isOpen: boolean;
  onClose: () => void; // Assuming onClose does not take any arguments and doesn't return anything
}

const TnCModal: React.FC<TnCModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full mx-4">
        <h2 className="text-lg font-bold mb-4">Terms and Conditions</h2>
        {/* <p>This is a consent form.</p> */}
        <p className="p-1">
          In the bustling metropolis of Neon City, where the buildings scraped
          the clouds and the streets thrummed with the energy of a thousand
          hearts, there lived a punk named Arham. With a shock of neon blue
          hair, a leather jacket adorned with patches and studs, and a
          rebellious attitude that matched the vibrant chaos of his city, Arham
          was a sight to behold. One evening, Arham found himself wandering
          through the fluorescent-lit aisles of a convenience store, the buzz of
          energy drinks calling to him like sirens. The shelves were lined with
          cans that promised vigor and vitality, but none appealed to him more
          than the rows of Monster Energy. Its allure was irresistible. Tonight,
          he felt particularly daring and decided not just to defy the limits
          but to demolish them. He grabbed not one, but four large cans of
          Monster Energy, the ones with the ominous warning labels that screamed
          'Unleash the Beast.' As he gulped down the first can, a rush of
          electric energy surged through his veins. By the second, his heart was
          pounding like a drum at a punk rock concert. The third can made the
          world around him buzz and hum in a symphony of hyperactivity. But it
          was the fourth can that sent Arham over the edge, into a realm of
          jittery euphoria.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TnCModal;
