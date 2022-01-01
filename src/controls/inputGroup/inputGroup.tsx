import Styles from "./inputGroup.module.scss";

function InputGroup(props: any) {
  debugger;
  return (
    <div className={Styles.inputGroup}>
      <div className={Styles.inputLabel}>{props.labelText}</div>
      <input
        type="text"
        defaultValue={props.defaultValue}
        onChange={(x) => {
          props.onChange(x);
        }}
      ></input>
    </div>
  );
}
export default InputGroup;
