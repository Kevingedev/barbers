/**
 * Carpeta `/back`.
 *
 * Este layout NO protege nada a propósito: el que protege es el del grupo
 * `(panel)`, que envuelve las páginas del panel pero no el login.
 *
 * Si la protección estuviera aquí, el layout se aplicaría también a
 * `/back/login` y lo mandaría a sí mismo en bucle: al pedir el login
 * redirigiría al login, y así hasta que el navegador se rindiera.
 *
 * El nombre `(panel)` no aparece en la URL: `/back` sigue siendo `/back`.
 */
export default function BackLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}