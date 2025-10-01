import { DataType, Model, Column, Table } from "sequelize-typescript";

export enum RequestStatus {
    New = 'new',
    InProgress = 'in_progress',
    Done = 'done'
}

@Table({
    tableName: 'requests'
})
export class Request extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string

    @Column({
        type: DataType.ENUM(RequestStatus.New, RequestStatus.InProgress, RequestStatus.Done),
        defaultValue: RequestStatus.New,
        allowNull: false
    })
    status: RequestStatus
}