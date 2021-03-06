import { useForm } from "react-hook-form";
import { Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DragabbleCard from "./DragabbleCard";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
import React from "react";
import { motion } from "framer-motion";

const Wrapper = styled(motion.div)`
  width: 250px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const TitleDiv = styled.div<{isDragging: boolean}>`
background-color: ${(props) =>
  props.isDragging ? "#FCD1D1" : props.theme.boardColor};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 7px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, .5);
    margin-bottom: 10px;

`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  font-size: 20px;
`;

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  display:flex;
  justify-content: center;
`;
const Input = styled.input`

border: none;
    border-radius: 15px;
    width: 90%;
    font-size: 20px;
    text-align: center;
    &:focus {
      outline: none;
  }
`

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
  boardIndex: number;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, boardIndex }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue("toDo", "");
  };
  return (
    <Draggable draggableId={boardId} index={boardIndex}>
      {(magic, info) => (
        <Wrapper
          ref={magic.innerRef}
          {...magic.draggableProps}
        >
          <TitleDiv isDragging={info.isDragging} {...magic.dragHandleProps}>
            <Title>{boardId}</Title>
          </TitleDiv>
          <Form onSubmit={handleSubmit(onValid)}>
            <Input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`Add task on ${boardId}`}
              autoComplete="off"
            />
          </Form>
          <Droppable droppableId={boardId}>
            {(magic, info) => (
              <Area
                isDraggingOver={info.isDraggingOver}
                isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                {toDos.map((toDo, index) => (
                  <DragabbleCard
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                  />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}
export default React.memo(Board);
