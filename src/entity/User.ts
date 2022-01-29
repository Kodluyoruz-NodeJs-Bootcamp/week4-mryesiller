import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()       
    username: string;

    @Column({unique: true})   
    email: string;

    @Column()    
    password: string;   

    @CreateDateColumn()
    Created_at:Date

}
