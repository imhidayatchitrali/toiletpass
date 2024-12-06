import React from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [messageSent, setMessageSent] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Show success message
    setMessageSent(true);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
    // Hide success message after 5 seconds
    setTimeout(() => {
      setMessageSent(false);
    }, 5000);
  };

  return (
    <div id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Contactez-nous</h2>
          <p className="text-lg text-gray-600">
            Une question ? N'hésitez pas à nous contacter
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-600">
                    <a href="mailto:antoineolivier12@yahoo.fr" className="hover:text-blue-600">
                      antoineolivier12@yahoo.fr
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Téléphone</h3>
                  <p className="mt-1 text-gray-600">Du lundi au vendredi, 9h-18h</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Support</h3>
                  <p className="mt-1 text-gray-600">
                    Réponse sous 24h ouvrées
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-lg">
            {messageSent && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded relative">
                Message bien envoyé
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                id="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};