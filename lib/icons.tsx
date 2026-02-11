import { FiExternalLink, FiGithub, FiFileText, FiDatabase, FiGlobe } from 'react-icons/fi'

/**
 * Returns the appropriate icon component for a given external link type.
 */
export function getExternalLinkIcon(linkType: string, className = 'w-5 h-5') {
  switch (linkType) {
    case 'code':
      return <FiGithub className={className} />
    case 'paper':
      return <FiFileText className={className} />
    case 'data':
      return <FiDatabase className={className} />
    case 'demo':
    case 'website':
      return <FiGlobe className={className} />
    default:
      return <FiExternalLink className={className} />
  }
}
