import React, {useEffect, useMemo} from "react";
import "./index.css";

export default function KanbanBoard(props) {

    let [tasks, setTasks] = React.useState([]);

    const [userInput, setUserInput] = React.useState("");

    let [stagesNames, setStagesNames] = React.useState(['Backlog', 'To Do', 'Ongoing', 'Done']);


    const stagesTasks = useMemo(()=>{
        let _stagesTasks = [];
        for (let i = 0; i < stagesNames.length; ++i) {
            _stagesTasks.push([]);
        }
        for (let task of tasks) {
            const stageId = task.stage;

            if(stageId!==undefined && _stagesTasks[stageId])
                _stagesTasks[stageId].push(task);
        }

        return _stagesTasks;
    },[tasks]);

    useEffect(()=>{
        setTasks([
            {name: '1', stage: 0},
            {name: '2', stage: 0},
        ]);
    },[]);



    const saveNewTask = (e) => {
        if (userInput.length < 1) return;
        setTasks((state) => {
            return [...state,
                {name: userInput, stage: 0}
            ];
        });
    };

    const changeStage = (tasks,idTask,isIncrement) =>{
        const changeStageForTask = (taskStage)=> {
            return isIncrement ? taskStage + 1 : taskStage - 1;
        };

        return tasks.map((tsk,i)=>{
            const task = idTask !== i ? tsk : Object.assign(tsk,{stage: changeStageForTask(tsk.stage)}); // seems spread operator for obj is not available
            return(task );
        });
    };


    const doBackStage =(taskIndex)=>{
        const newTasksState = changeStage(tasks,taskIndex,false);
        setTasks(newTasksState);
    };

    const doForwardStage =(taskIndex)=>{
        const newTasksState = changeStage(tasks,taskIndex,true);
        setTasks(newTasksState);
    };

    const deleteTask = (taskIndex) => {
        const newTasksState = tasks.filter((t,i)=>{
            return i !== taskIndex;
        });

        setTasks(newTasksState);
    };

    return (
        <div className="mt-20 layout-column justify-content-center align-items-center">
            <section className="mt-50 layout-row align-items-center justify-content-center">
                <input
                    id="create-task-input"
                    type="text"
                    className="large"
                    placeholder="New task name"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    data-testid="create-task-input"/>
                <button type="submit"
                        onClick={saveNewTask}
                        className="ml-30"
                        data-testid="create-task-button">Create task
                </button>
            </section>

            <div className="mt-50 layout-row">
                {stagesTasks.map((tasks, i) => {
                    return (
                        <div className="card outlined ml-20 mt-0" key={`${i}`}>
                            <div className="card-text">
                                <h4>{stagesNames[i]}</h4>
                                <ul className="styled mt-50" data-testid={`stage-${i}`}>
                                    {tasks.map((task, index) => {
                                        return <li className="slide-up-fade-in" key={`${i}${index}`}>
                                            <div
                                                className="li-content layout-row justify-content-between align-items-center">
                                                <span
                                                    data-testid={`${task.name.split(' ').join('-')}-name`}>{task.name}</span>
                                                <div className="icons">
                                                    {task.stage > 0 && (
                                                        <button className="icon-only x-small mx-2"
                                                                onClick={()=>doBackStage(i)}
                                                             data-testid={`${task.name.split(' ').join('-')}-back`}>
                                                        <i className="material-icons">arrow_back</i>
                                                        </button>)}

                                                    {task.stage < 3 && (
                                                        <button className="icon-only x-small mx-2"
                                                                onClick={()=>doForwardStage(i)}
                                                             data-testid={`${task.name.split(' ').join('-')}-forward`}>
                                                        <i className="material-icons">arrow_forward</i>
                                                        </button>)}

                                                    <button className="icon-only danger x-small mx-2"
                                                            onClick={()=>deleteTask(i)}
                                                            data-testid={`${task.name.split(' ').join('-')}-delete`}>
                                                        <i className="material-icons">delete</i>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    })}
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}