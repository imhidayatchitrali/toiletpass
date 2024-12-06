import QRCode from 'react-qr-code';

export const MobileQRCode = () => (
  <div className="flex justify-center">
    <QRCode value="https://guileless-gaufre-3b4bfc.netlify.app" />
  </div>
);