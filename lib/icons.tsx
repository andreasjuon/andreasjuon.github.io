import { FiExternalLink, FiGithub, FiFileText, FiDatabase, FiGlobe, FiLink } from 'react-icons/fi'

/**
 * Returns the appropriate icon component for a given external link type.
 */
export function getExternalLinkIcon(linkType: string, className = 'w-5 h-5') {
  switch (linkType) {
    case 'code':
      return <FiGithub className={className} />
    case 'paper':
    case 'pdf':
      return <FiFileText className={className} />
    case 'data':
      return <FiDatabase className={className} />
    case 'demo':
    case 'website':
    case 'description':
      return <FiGlobe className={className} />
    case 'doi':
    case 'supplementary':
      return <FiLink className={className} />
    default:
      return <FiExternalLink className={className} />
  }
}
