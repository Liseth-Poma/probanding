import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestión de Laboratorios - Control de Prácticas',
  description: 'Sistema de gestión de laboratorios universitarios',
}

export default function LaboratoriosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}