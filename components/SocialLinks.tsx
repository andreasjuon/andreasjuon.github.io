import { FiGithub, FiMail } from 'react-icons/fi'
import { FaTwitter } from 'react-icons/fa'
import { FaBluesky } from 'react-icons/fa6'
import { AiOutlineDatabase } from 'react-icons/ai'
import { SiGooglescholar } from 'react-icons/si'

interface SocialLinksProps {
  github?: string
  scholar?: string
  twitter?: string
  bluesky?: string
  dataverse?: string
  email?: string
  className?: string
}

export default function SocialLinks({
  github,
  scholar,
  twitter,
  bluesky,
  dataverse,
  email,
  className = '',
}: SocialLinksProps) {
  const links = [
    { href: scholar, icon: SiGooglescholar, label: "Google Scholar" },
    { href: twitter, icon: FaTwitter, label: "Twitter" },
    { href: bluesky, icon: FaBluesky, label: "Bluesky" },
    { href: dataverse, icon: AiOutlineDatabase, label: "Dataverse" },
    { href: github, icon: FiGithub, label: "GitHub" },
    {
      href: email ? `mailto:${email}` : undefined,
      icon: FiMail,
      label: "Email",
    },
  ].filter((link) => link.href);

  if (links.length === 0) return null

  return (
    <div className={`flex gap-4 ${className}`}>
      {links.map((link) => {
        const Icon = link.icon
        return (
          <a
            key={link.label}
            href={link.href}
            target={link.href?.startsWith('mailto:') ? undefined : '_blank'}
            rel={link.href?.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={link.label}
          >
            <Icon className="w-6 h-6" />
          </a>
        )
      })}
    </div>
  )
}
