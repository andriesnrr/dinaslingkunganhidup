import React from 'react';

export default function KontakPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-primary">Hubungi Kami</h1>
            <p className="text-on-surface-variant text-base">
              Silakan datang langsung ke kantor kami atau hubungi kami melalui saluran komunikasi resmi di bawah ini.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 p-6 bg-white rounded-2xl border border-outline-variant shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">corporate_fare</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-on-surface">Kantor Pusat DLH Gresik</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Jl. KH. Wachid Hasyim No.17, Pekelingan, Kec. Gresik, Kabupaten Gresik, Jawa Timur 61114
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-2xl border border-outline-variant shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">biotech</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-on-surface">UPT Laboratorium Lingkungan</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Jl. Raya Permata No. 07, Graha Bunder Asri, Kec. Kebomas, Kabupaten Gresik, Jawa Timur
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-2xl border border-outline-variant shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">call</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-on-surface font-semibold text-primary">Telepon / Fax</h4>
                <p>
                  <a
                    href="tel:0313981242"
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors hover:underline"
                  >
                    (031) 3981242
                  </a>
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-2xl border border-outline-variant shadow-sm">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">mail</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-on-surface font-semibold text-primary">Email Resmi</h4>
                <p>
                  <a
                    href="mailto:info@dlhgresik.go.id"
                    className="text-sm text-on-surface-variant hover:text-primary transition-colors hover:underline"
                  >
                    info@dlhgresik.go.id
                  </a>
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white rounded-2xl border border-outline-variant shadow-sm">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">chat</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-on-surface font-semibold text-green-600">WhatsApp Hotline</h4>
                <p>
                  <a
                    href="https://wa.me/6282221742244"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-on-surface-variant hover:text-green-600 transition-colors hover:underline font-semibold"
                  >
                    0822-2174-2244
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="w-full bg-white p-4 rounded-3xl border border-outline-variant shadow-sm overflow-hidden h-[450px] lg:h-[550px] relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.7360755281193!2d112.65383847454439!3d-7.156482370210962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8005a0aa73807%3A0x5164b408509e2066!2sDinas%20Lingkungan%20Hidup%20Kabupaten%20Gresik!5e0!3m2!1sen!2sid!4v1781744764679!5m2!1sen!2sid"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '1.5rem' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Kantor DLH Kabupaten Gresik"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
