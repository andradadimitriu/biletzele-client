import React from "react";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import NewGame from "./NewGame";
import PendingGames from "./PendingGames";
import MyGames from "./MyGames";
export class Biletzele extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "join" };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(value) {
      this.setState({value});
  }

  render() {
      return (
      <div className="horizontalflex margin-full">
          <ToggleButtonGroup type="radio" value={this.state.value} name="radioAll" onChange={this.handleChange}>
                        <ToggleButton variant="light" name="radio1" value={"join"}>Join Game</ToggleButton>
                        <ToggleButton variant="light" name="radio2" value={"mine"}>My Games</ToggleButton>
                        <ToggleButton variant="light" name="radio3" value={"new"}>New Game</ToggleButton>
          </ToggleButtonGroup>
          <TabSwitch tabSelected={this.state.value}/>
       </div>);
  }

}
function TabSwitch({tabSelected}) {
    switch(tabSelected) {
        case "new":
            return <NewGame/>;
        case "mine":
            return <MyGames/>;
        default:
            return <PendingGames/>;
    }
}