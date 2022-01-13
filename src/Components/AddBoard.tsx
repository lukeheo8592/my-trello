import React from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Form = styled.form`
margin:0 auto;
margin-top: 30px;
margin-bottom: 70px;
display:flex;
font-size: 16px !important;
font-weight: 300 !important;
color: #eee !important;
line-height: 1.625 !important;
 
background-color: #eee !important;
background-repeat: no-repeat;
background-position: 95% 50%;
 
border: 0px !important;
border-radius: 32px !important;
 
width: 30% !important;
padding: 15px !important;
cursor: auto !important;

input {
    border: none;
    width: 100%;
    height: 100%;
    background-color: #eee !important;
    font-size: 25px;
    border-radius: none;

    :focus{
        outline-style: none;
	    box-shadow: none;
	    border-color: transparent; 
        text-align: center;

        ::placeholder{
            color:transparent;
         }
    }
    ::placeholder {
      color: black;
      text-align: center;
      font-size: 25px;
    
    }

`;

interface IForm {
  board: string;
}

function AddBoard() {
  const { register, setValue, handleSubmit } = useForm();
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onSubmit = ({ board }: IForm) => {
    const input = board + "";
    setToDos((allBoards) => {
      console.log(allBoards);
      return {
        ...allBoards,
        [input]: [],
      };
    });
    setValue("board", "");
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        {...register("board", { required: true })}
        placeholder="Add New Board"
        autoComplete="off"
      />
    </Form>
  );
}

export default AddBoard;
