import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown , faChevronRight} from "@fortawesome/free-solid-svg-icons";

export default function MinimalCollapsible({headerText, content}) {
    const [expanded, setExpanded] = useState(false);
    return <div style={{  textAlign: "center"
    }}>
        <div>Round</div>
        <div onClick={()=>setExpanded(!expanded)}><FontAwesomeIcon style={{marginRight: 10}} icon={expanded ? faChevronRight : faChevronDown} color={"#EB8C00"}/><strong>{headerText}</strong></div>
        { expanded && <div >        {content}
        </div>}
    </div>
}


