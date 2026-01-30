import { Table, Column, DataType, BelongsTo, ForeignKey, Model, AllowNull } from "sequelize-typescript";
import Budget from "./Budget.js";

@Table({ tableName: "expenses" })
class Expense extends Model {

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

    @ForeignKey(() => Budget)
    declare budgetId: number

    @BelongsTo(() => Budget, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    declare budget: Budget
}

export default Expense