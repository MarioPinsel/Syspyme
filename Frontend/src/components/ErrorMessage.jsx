export default function ErrorMessage({ children }) {
  return (
    <div style={{
      color: '#b00020',
      background: 'rgba(176,0,32,0.06)',
      padding: '6px 10px',
      borderRadius: 6,
      marginTop: 6,
      fontSize: 14,
    }}>{children}</div>
  );
}
