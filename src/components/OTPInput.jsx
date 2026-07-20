import React, { useRef } from "react";
import "./OTPInput.css";

export default function OTPInput({
    length = 6,
    value = [],
    onChange
}){

    const refs = useRef([]);

    function handleChange(index,val){

        if(!/^[0-9]?$/.test(val))
            return;

        const values=[...value];

        values[index]=val;

        onChange(values);

        if(val && index<length-1){

            refs.current[index+1].focus();

        }

    }

    function handleKeyDown(index,e){

        if(
            e.key==="Backspace" &&
            !value[index] &&
            index>0
        ){

            refs.current[index-1].focus();

        }

    }

    return(

        <div className="otp">

            {Array.from({
                length
            }).map((_,index)=>(

                <input

                    key={index}

                    ref={el=>refs.current[index]=el}

                    maxLength={1}

                    value={value[index]||""}

                    onChange={(e)=>
                        handleChange(
                            index,
                            e.target.value
                        )
                    }

                    onKeyDown={(e)=>
                        handleKeyDown(index,e)
                    }

                />

            ))}

        </div>

    );

}