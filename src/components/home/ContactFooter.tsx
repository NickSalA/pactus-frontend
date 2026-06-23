import Link from 'next/link';
import BrandMark from './shared/BrandMark';
import { contactItems, footerLinks } from '@/lib/landingContent';

export default function ContactFooter() {
  return (
    <footer
      id="contacto"
      className="scroll-mt-36 bg-brand-neutral-900 px-6 py-14 text-white lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr_0.7fr]">
        <div>
          <BrandMark variant="light" />
          <p className="mt-5 max-w-md leading-7 text-white/70">
            Plataforma de gestión y análisis legal impulsada por IA para
            automatizar contratos, consultas y documentación empresarial.
          </p>
          <p className="mt-4 text-sm font-medium text-brand-primary-light">
            Desarrollo de Software, Automatización e IA para Empresas
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Contacto</h3>
          <div className="mt-5 space-y-4">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <span className="flex items-center gap-3 text-white/75 transition-colors hover:text-white">
                  <Icon size={18} className="text-brand-primary-light" />
                  {item.label}
                </span>
              );

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {content}
                </a>
              ) : (
                <div key={item.label}>{content}</div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Enlaces</h3>
          <div className="mt-5 flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/75 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-white/50">
        (c) {new Date().getFullYear()} Pactus. Todos los derechos reservados.
      </div>
    </footer>
  );
}
