import { NavButton, PageContent, PageElement } from "../components/multiuse-elements";

export default function UnknownPage(){
    return(
        <PageContent page={{heading:"Oops!", subheading:"Looks like that page doesn't exist..."}}>
            <PageElement>
                <NavButton content={{link:"/", title:"Go Home"}} />
            </PageElement>
        </PageContent>
    )
}