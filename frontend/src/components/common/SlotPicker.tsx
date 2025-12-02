interface SlotPickerProps {
  slots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
}

const SlotPicker = ({ slots, selectedSlot, onSelectSlot }: SlotPickerProps) => {
  return (
    <div>
      <h3 className="font-semibold text-foreground mb-3">Available Time Slots</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelectSlot(slot)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSlot === slot
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-primary/10'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
      {slots.length === 0 && (
        <p className="text-muted-foreground text-sm">No slots available for this date</p>
      )}
    </div>
  );
};

export default SlotPicker;
