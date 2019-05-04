export class TaskModel {
    id?: number;
    creator?: any;
    name?: string;
    description?: string;
    task_template?: any;
    jCustomForm_input?: any;
    jCustomForm_output?: any;
    jFormData_input?: any;
    jFormData_output?: any;
    priority: number;
    accepted: boolean;
}



export class TaskTemplateModel {
    id?: number = null;
    owner?: any = null;
    name?: string = 'New Template';
    user_default?: boolean = false;
    form?: any = {};
}
