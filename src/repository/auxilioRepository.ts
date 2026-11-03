import prisma from "../config/database";
import { CreateAuxilioDTO } from "../models/auxilioModel";

export class AuxilioRepository {
    public static async create(data: CreateAuxilioDTO) {
        return prisma.auxilio.create({ data });
    }

    public static async findAll() {
        return prisma.auxilio.findMany({
            orderBy: { nome: "asc" }
        });
    }

    public static async findById(id: number) {
        return prisma.auxilio.findUnique({
            where: { id }
        });
    }
}
