import Link from 'next/link'

export default function Nav(){

  return (
    <ul>
      <li>
        <Link href="/objects">
          <a>
            全て 
          </a>
        </Link>
      </li>
    </ul>
  )
}
