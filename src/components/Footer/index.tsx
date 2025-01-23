import './footer.css'

const year = new Date().getFullYear()

export default function Footer() {
    return (
        <footer>
            <div>© copyright {year} All rights reserved.</div>
        </footer>
    )
}