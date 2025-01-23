import { FaFire } from "react-icons/fa6";
import TrendingSongs from "@/components/TrendingSongs";
import PopularWordContainer from "@/components/PopularWordContainer";
export const runtime = "edge"

export default async function Popular() {

    return (
        <section className="layout-two-container">
            <div className="left">
                <h1 className="custom-heading"><i><FaFire /></i>Popular Keywords</h1>
                <PopularWordContainer/>
            </div>
            <div className="right">
                <TrendingSongs />
            </div>
        </section>
    )
}