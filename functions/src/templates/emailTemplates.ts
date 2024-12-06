export const getReservationConfirmationTemplate = (data: {
  userName: string;
  confirmationCode: string;
  establishmentName: string;
  establishmentAddress: string;
  amount: number;
  timeSlot: {
    start: string;
    end: string;
  };
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background-color: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
    .confirmation-code { background-color: #2563eb; color: white; padding: 10px; text-align: center; font-size: 24px; margin: 20px 0; border-radius: 4px; }
    .info { margin: 20px 0; }
    .info-item { margin: 10px 0; }
    .time-slot { background-color: #dbeafe; padding: 15px; border-radius: 4px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Confirmation de réservation</h1>
    </div>
    
    <div class="content">
      <p>Bonjour ${data.userName},</p>
      
      <p>Votre réservation a été confirmée avec succès.</p>
      
      <div class="confirmation-code">
        Code de confirmation: ${data.confirmationCode}
      </div>
      
      <div class="time-slot">
        <h3>🕒 Créneau horaire réservé</h3>
        <p>De ${data.timeSlot.start} à ${data.timeSlot.end}</p>
        <p style="font-size: 14px; color: #64748b;">
          Veuillez vous présenter à l'établissement pendant ce créneau horaire
        </p>
      </div>
      
      <div class="info">
        <div class="info-item">
          <strong>Établissement:</strong> ${data.establishmentName}
        </div>
        <div class="info-item">
          <strong>Adresse:</strong> ${data.establishmentAddress}
        </div>
        <div class="info-item">
          <strong>Montant payé:</strong> ${data.amount}€
        </div>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 15px; border-radius: 4px;">
        <h4 style="margin-top: 0;">Instructions:</h4>
        <ul>
          <li>Présentez ce code à l'établissement</li>
          <li>Le code est à usage unique</li>
          <li>Valable uniquement pendant le créneau horaire indiqué</li>
        </ul>
      </div>
    </div>
    
    <div class="footer">
      <p>
        Cet email a été envoyé automatiquement par ToiletPass.<br>
        En cas de problème, contactez notre support.
      </p>
    </div>
  </div>
</body>
</html>
`;