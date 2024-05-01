import { Card } from "./card";

export class UserCard {
    id?: number;
    inVendita?: boolean;
    attivo?: boolean;
    foil?: boolean;
    card?: Card;
    date?: Date;
}