import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown , faChevronRight} from "@fortawesome/free-solid-svg-icons";

export default function RoundSelectCollapsible({headerText, content}) {
    const [expanded, setExpanded] = useState(false);
    return <div>
        <div onClick={()=>setExpanded(!expanded)} style={{display: "flex", alignItems: "center"}} >
            <div>{headerText}</div>
            <FontAwesomeIcon style={{margin: 5}} icon={expanded ? faChevronRight : faChevronDown} color={"#EB8C00"}/>
        </div>
        { expanded && <p>{content}</p>}
    </div>
}


