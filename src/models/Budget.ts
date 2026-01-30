import { Table, Column, DataType, Model, HasMany, AllowNull, BelongsTo, ForeignKey } from "sequelize-typescript";
import type Expense from "./Expense.js";
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

    @HasMany(() => Expense, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    declare expenses: Expense[]

    @ForeignKey(() => User)
    declare userId: number

    @BelongsTo(() => User)
    declare user: User
}

export default Budget