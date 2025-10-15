import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CartItem } from "./Cart";
import { toast } from "sonner";

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderComplete: () => void;
}

const OrderForm = ({
  isOpen,
  onClose,
  items,
  total,
  onOrderComplete,
}: OrderFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryMethod: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.deliveryMethod) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.deliveryMethod === "delivery" && !formData.address) {
      toast.error("Please provide a delivery address");
      return;
    }

    // Prepare order data
    const orderData = {
      customer: formData,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: total,
      orderDate: new Date().toISOString(),
    };

    // Submit order to PHP backend
    try {
      const response = await fetch('http://localhost/api/submit-order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit order');
      }

      toast.success("Order placed successfully! We'll contact you shortly.");
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Failed to submit order. Please try again.");
      return;
    }
    onOrderComplete();
    onClose();

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      deliveryMethod: "",
      notes: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            Complete Your Order
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="deliveryMethod">Delivery Method *</Label>
              <Select
                value={formData.deliveryMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, deliveryMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.deliveryMethod === "delivery" && (
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any special requests or preferences..."
              />
            </div>
          </div>

          <div className="bg-secondary/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Place Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
