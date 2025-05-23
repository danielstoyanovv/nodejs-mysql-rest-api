"use strict";

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from "typeorm"

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @Column({
        type: "varchar",
        length: 150,
        unique: true,
    })
    email: string
    
    @Column({
        type: "varchar",
        length: 256,
    })
    password: string

    @Column({
        type: "varchar",
        length: 10,
        
    })    
    role: string

    @CreateDateColumn()
    created_at: Date;
}