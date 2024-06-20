export interface Manager {
    id:         number;
    firstName:  string;
    lastName:   string;
    email:      string;
    isActive:   boolean;
    rol:        string;
}

export interface ManagerFormDTO   {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    ubications: number[];
}

export interface ManagerUpdateDTO extends Omit<ManagerFormDTO, 'ubications'> {}
