import { Table, Column, DataType, Model, AllowNull, BelongsTo, ForeignKey } from "sequelize-typescript";
import User from "./User.js";

@Table({ tableName: 'budgets' })
class Budget extends Model {

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string
    
    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL
    })
    declare amount: number

    @ForeignKey(() => User)
    declare userId: number

    @BelongsTo(() => User)
    declare user: User
}

export default Budget