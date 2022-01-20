import { useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import AddBoard from "./Components/AddBoard";
import Board from "./Components/Board";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons'
const Wrapper = styled.div`
  display: flex;
  flex-direction: raw;
  width: 90%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  flex-wrap: no-wrap;
  width: 100%;
  gap: 20px;
`;
const Main = styled.title`
  margin-top: 10px;
  display: flex;
  margin-left: 100px;
  align-items: center;
  font-size: 40px;
  font-weight: 600;
`;
const DeleteArea = styled.div<IAreaProps>`
  width: 200px;
  height: 200px;
 position: absolute;
  
`;
const TrashBox = styled.div`
width: 250px;
height: 250px;
margin: auto;
margin-top: 100px;
display:flex;
justify-content: center;
align-items: center;
&:hover {
  transform: scale(1.3);
  svg {
    color: red;
  }
}
`


interface IAreaProps {
  isDraggingOver: boolean;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { type, destination, draggableId, source } = info;

    if (!destination || !source) return;
    if (destination?.droppableId === 'DeleteCard' || destination?.droppableId === 'DeleteBoard') {
      if(destination?.droppableId === 'DeleteCard'){
        setToDos((allBoard) => {
          const sourceBoard = [...allBoard[source.droppableId]];
          sourceBoard.splice(source.index, 1);
          return { ...allBoard, [source.droppableId]: sourceBoard };
        });
      }else{
        setToDos((prev) => {
          const newBoard = {...prev};
          delete newBoard[info.draggableId];
          return newBoard
        })
      }
     
    }else if (type === "board") {
      if (destination?.index === source.index) return;
      setToDos((prev) => {
        const new_board = Object.entries(prev);
        const [temp] = new_board.splice(source.index, 1);
        new_board.splice(destination.index, 0, temp);
        return new_board.reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value,
          }),
          {}
        );
      });
    } else if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    } else if (destination.droppableId !== source.droppableId) {
      // cross board movement
      setToDos((allBoard) => {
        const sourceBoard = [...allBoard[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoard[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoard,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };
  useEffect(() => {
    const savedItem = localStorage.getItem("myList");
    if (savedItem === "{}" || savedItem === null) {
      return;
    }
    setToDos(JSON.parse(savedItem));
  }, []);
  useEffect(() => {
    localStorage.setItem("myList", JSON.stringify(toDos));
  }, [toDos]);
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Main>✔ To Do list</Main>
      <AddBoard />
      <Wrapper>
        <Droppable
          droppableId="droppableBoards"
          type="board"
          direction="horizontal"
        >
          {(magic) => (
            
            <Boards ref={magic.innerRef} {...magic.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  key={boardId}
                  boardId={boardId}
                  toDos={toDos[boardId]}
                  boardIndex={index}
                />
              ))}
              {magic.placeholder}
            </Boards>
          )}
        </Droppable>
      </Wrapper>

      <TrashBox>
      <Droppable droppableId="DeleteCard">
          {(magic, snapshot) => (
            <>
              <DeleteArea
                isDraggingOver={snapshot.isDraggingOver}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
              </DeleteArea>
              {magic.placeholder}
            </>
          )}
        </Droppable>
        <FontAwesomeIcon icon={faTrash} size={"4x"} color={"white"} />
        <Droppable droppableId="DeleteBoard" type="board">
          {(magic, snapshot) => (
            <>
              <DeleteArea
                isDraggingOver={snapshot.isDraggingOver}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
              </DeleteArea>
              {magic.placeholder}
            </>
          )}
        </Droppable>
      </TrashBox>
      
    </DragDropContext>
  );
}

export default App;
