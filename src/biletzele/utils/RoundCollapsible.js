import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown , faChevronRight} from "@fortawesome/free-solid-svg-icons";

export default function RoundCollapsible({headerText, content}) {
    const [expanded, setExpanded] = useState(false);
    return <div style={{ textAlign: "center"}}>
        <div>Round</div>
        <div onClick={()=>setExpanded(!expanded)} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
            <FontAwesomeIcon  style={{marginRight: 10}} icon={expanded ? faChevronRight : faChevronDown} color={"#EB8C00"}/>
            <strong style={{fontSize: "2em"}}>{headerText}</strong>
        </div>
        { expanded && <p style={{fontSize: "1.5em"}}>{content}</p>}
    </div>
}


