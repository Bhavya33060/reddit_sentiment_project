function Toggle({ value, onChange }) {
  return (
    <div
      className={`toggle ${value ? "on" : ""}`}
      onClick={() => onChange(!value)}
    >
      <div className="toggle-circle"></div>
    </div>
  );
}

export default Toggle;